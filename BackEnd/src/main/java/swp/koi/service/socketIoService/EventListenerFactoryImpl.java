package swp.koi.service.socketIoService;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventListenerFactoryImpl implements EventListenerFactory {
    private static String eventName;
    private final SocketIOServer socketServer;

    @Override
    public void createDataListener(SocketIOServer socketServer, String name) {
        eventName = name;
        socketServer.addEventListener("Event"+name,SocketDetail.class,event);
    }

    public DataListener<SocketDetail> event= new DataListener<>() {
        @Override
        public void onData(SocketIOClient socketIOClient, SocketDetail socketDetail, AckRequest ackRequest) throws Exception {
            socketServer.getBroadcastOperations().sendEvent("Event"+eventName,socketDetail);
            System.out.println(socketDetail.getName());
            ackRequest.sendAckData("Data received");
        }
    };
}
