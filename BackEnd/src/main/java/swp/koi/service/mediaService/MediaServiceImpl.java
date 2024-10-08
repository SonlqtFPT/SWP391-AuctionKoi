package swp.koi.service.mediaService;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.MediaDTO;
import swp.koi.model.Media;
import swp.koi.repository.MediaRepository;

@Service
@Transactional
public class MediaServiceImpl implements MediaService{

    private final MediaRepository mediaRepository;

    public MediaServiceImpl(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    @Override
    public Media createMediaFromRequest(MediaDTO mediaRequest) {
        Media media = new Media();
        media.setImageUrl(mediaRequest.getImageUrl());
        media.setVideoUrl(mediaRequest.getVideoUrl());
        return mediaRepository.save(media);
    }
}
