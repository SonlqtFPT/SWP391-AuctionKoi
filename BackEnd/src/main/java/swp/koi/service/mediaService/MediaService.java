package swp.koi.service.mediaService;

import swp.koi.dto.request.MediaDTO;
import swp.koi.dto.request.MediaUpdateDTO;
import swp.koi.model.Media;

import java.util.Optional;

public interface MediaService {
    Media createMediaFromRequest(MediaDTO mediaDTO);

    Media findByMediaId(Integer mediaId);

    void save(Media media);
}
