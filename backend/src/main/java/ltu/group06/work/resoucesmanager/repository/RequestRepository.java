package ltu.group06.work.resoucesmanager.repository;

import ltu.group06.work.resoucesmanager.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
//    List<Request> findByUser_UserId(Integer userId);

    Optional<Request> findById(Integer requestId);

    //    List<Request> findByUserId(int userId);
    List<Request> findByUser_Id(Long userId);

    List<Request> findByStatus(Request.Status status);
}
