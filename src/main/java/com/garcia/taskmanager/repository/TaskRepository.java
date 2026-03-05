package com.garcia.taskmanager.repository;

import com.garcia.taskmanager.model.Task;
import com.garcia.taskmanager.model.TaskPriority;
import com.garcia.taskmanager.model.TaskStatus;
import com.garcia.taskmanager.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);

    Page<Task> findByUser(User user, Pageable pageable);
    Page<Task> findByUserAndStatus(User user, TaskStatus status, Pageable pageable);
    Page<Task> findByUserAndPriority(User user, TaskPriority priority, Pageable pageable);
    Page<Task> findByUserAndStatusAndPriority(User user, TaskStatus status, TaskPriority priority, Pageable pageable);

    List<Task> findByUserId(Long userId);
    List<Task> findByUserIdAndStatus(Long userId, TaskStatus status);
    List<Task> findByUserIdAndPriority(Long userId, TaskPriority priority);
}