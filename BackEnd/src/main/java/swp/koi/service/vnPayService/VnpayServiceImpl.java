package swp.koi.service.vnPayService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp.koi.config.VnpayConfig;
import swp.koi.model.Lot;
import swp.koi.model.LotRegister;
import swp.koi.model.Member;
import swp.koi.model.enums.LotRegisterStatusEnum;
import swp.koi.repository.LotRegisterRepository;
import swp.koi.repository.LotRepository;
import swp.koi.repository.MemberRepository;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VnpayServiceImpl implements VnpayService {

    private final LotRepository lotRepository;
    private final LotRegisterRepository lotRegisterRepository;
    private final MemberRepository memberRepository;


    //generate invoice that's it!!!
    @Override
    public String generateInvoice(int registerLot, int memberId, HttpServletRequest request) throws UnsupportedEncodingException {

        Lot lot = lotRepository.findById(registerLot)
                .orElseThrow(() -> new NoSuchElementException("Lot with such id not found"));

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = (long) lot.getDeposit() * 100;
        String bankCode = "NCB";

        String vnp_TxnRef = VnpayConfig.getRandomNumber(8);
        String vnp_IpAddr = VnpayConfig.getIpAddress(request);

        String vnp_TmnCode = VnpayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new LinkedHashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "memberid=" + memberId + "&registerlot=" + registerLot);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnpayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Create date and expiration time
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Sort the parameters
        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        // Generate the secure hash
        String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        // Construct the payment URL
        String paymentUrl = VnpayConfig.vnp_PayUrl + "?" + query.toString();

        // Prepare the JSON response


        // Return response as JSON
        return paymentUrl;
    }

    //Using to check if response from vnpay after user complete their transactions correct or not
    @Override
    public boolean isResponseValid(HttpServletRequest request) throws UnsupportedEncodingException {

        Map<String, String> vnp_Params = new HashMap<>();
        Map<String, String[]> requestParams = request.getParameterMap();

        for (Map.Entry<String, String[]> entry : requestParams.entrySet()) {
            if (entry.getKey().startsWith("vnp_")) {
                vnp_Params.put(entry.getKey(), entry.getValue()[0]);
            }
        }

        // Extract the vnp_SecureHash from the request and remove it from the parameters map
        String vnpSecureHash = vnp_Params.remove("vnp_SecureHash");

        // Sort the parameters by key
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        // Build the hash data string
        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName).append("=").append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                    hashData.append("&");
                }
            }
        }

        // Generate the HMAC SHA512 hash
        String secureHashGenerated = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hashData.toString());

        // Validate the secure hash
        if (secureHashGenerated.equals(vnpSecureHash)) {
            // Hashes match, proceed to check the response status
            String responseCode = vnp_Params.get("vnp_ResponseCode");
            return "00".equals(responseCode);
        }
        return false;
    }


    //if the response is correct then assign member to slot
    // TECH_DEBT!!!!!!!!!!!!
    @Override
    public void regisMemberToLot(HttpServletRequest request) throws UnsupportedEncodingException {
        String orderInfo = request.getParameter("vnp_OrderInfo");

        if (orderInfo != null && !orderInfo.isEmpty()) {
            // URL decode the orderInfo value
            String decodedOrderInfo = URLDecoder.decode(orderInfo, StandardCharsets.UTF_8.toString());

            // Split the decoded string by '&' to get the key-value pairs
            Map<String, String> orderInfoMap = new HashMap<>();
            String[] pairs = decodedOrderInfo.split("&");
            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    orderInfoMap.put(keyValue[0], keyValue[1]);
                }
            }

            // Extract memberid and registerlot from the map
            String memberId = orderInfoMap.get("memberid");
            String registerLot = orderInfoMap.get("registerlot");

            Lot lot = lotRepository.findById(Integer.parseInt(registerLot))
                    .orElseThrow(()-> new RuntimeException("Lot not found"));

            Member member = memberRepository.findById(Integer.parseInt(memberId))
                    .orElseThrow(()-> new RuntimeException("Member not found"));

            LotRegister lotRegister = LotRegister.builder()
                    .deposit(lot.getDeposit())
                    .status(LotRegisterStatusEnum.WAITING)
                    .member(member)
                    .lot(lot)
                    .build();

            lotRegisterRepository.save(lotRegister);
        }
    }
}
