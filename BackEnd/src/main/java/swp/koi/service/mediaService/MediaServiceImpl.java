package swp.koi.service.mediaService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.MediaDTO;
import swp.koi.model.Media;
import swp.koi.repository.MediaRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService{

    private final MediaRepository mediaRepository;
    private final ModelMapper modelMapper;

    @Override
    public Media createMediaFromRequest(MediaDTO mediaRequest) {
        Media media = new Media();
        media.setImageUrl(mediaRequest.getImageUrl());
        media.setVideoUrl(mediaRequest.getVideoUrl());
        return mediaRepository.save(media);
    }

    @Override
    public Media updateMedia(MediaDTO mediaDTO) {
//        mediaRepository.findById(mediaDTO.get)
//        return mediaRepository.save(media);
        return null;
    }
}
