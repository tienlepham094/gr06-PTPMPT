package ltu.group06.work.resoucesmanager.dto;
import ltu.group06.work.resoucesmanager.entity.Resource;

public class AllocationRequestDto {
    private Long userId;
    private Resource.ResourceType resourceType;
    private int quantity;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Resource.ResourceType getResourceType() {
        return resourceType;
    }

    public void setResourceType(Resource.ResourceType resourceType) {
        this.resourceType = resourceType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
