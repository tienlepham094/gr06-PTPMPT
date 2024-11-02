package ltu.group06.work.resoucesmanager.service;

import ltu.group06.work.resoucesmanager.entity.Approval;
import ltu.group06.work.resoucesmanager.repository.ApprovalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ApprovalService {
    @Autowired private ApprovalRepository approvalRepository;
    public void saveApproval(Approval approval) {
        approvalRepository.save(approval);
    }
}
