package swp.koi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;

@RestController
@RequestMapping("/mapp")
public class COntroller {

    @GetMapping("/test")
    public ResponseData<?> test(){



        return new ResponseData<>(ResponseCode.SUCCESS);
    }
}
