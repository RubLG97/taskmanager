package com.garcia.taskmanager.repository;

import com.garcia.taskmanager.model.Task;
import com.garcia.taskmanager.model.TaskPriority;
import com.garcia.taskmanager.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
    List<Task> findByUserIdAndStatus(Long userId, TaskStatus status);
    List<Task> findByUserIdAndPriority(Long userId, TaskPriority priority);
}