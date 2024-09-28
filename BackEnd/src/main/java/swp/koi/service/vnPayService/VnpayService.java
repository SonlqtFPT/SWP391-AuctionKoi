package swp.koi.service.vnPayService;

import jakarta.servlet.http.HttpServletRequest;

import java.io.UnsupportedEncodingException;

public interface VnpayService {

    public String generateInvoice(int registerLot, int memberId, HttpServletRequest request) throws UnsupportedEncodingException;

    public boolean isResponseValid(HttpServletRequest request) throws UnsupportedEncodingException;

    public void regisMemberToLot(HttpServletRequest request) throws UnsupportedEncodingException;
}
