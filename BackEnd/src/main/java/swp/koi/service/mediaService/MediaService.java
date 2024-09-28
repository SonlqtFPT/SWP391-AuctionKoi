package swp.koi.service.mediaService;

import swp.koi.dto.request.MediaDTO;
import swp.koi.model.Media;

import java.util.Optional;

public interface MediaService {
    Media createMediaFromRequest(MediaDTO mediaDTO);
}
