package com.garcia.taskmanager.service;

import com.garcia.taskmanager.dto.TaskRequest;
import com.garcia.taskmanager.dto.TaskResponse;
import com.garcia.taskmanager.model.Task;
import com.garcia.taskmanager.model.TaskPriority;
import com.garcia.taskmanager.model.TaskStatus;
import com.garcia.taskmanager.model.User;
import com.garcia.taskmanager.repository.TaskRepository;
import com.garcia.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public TaskResponse createTask(TaskRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING);
        task.setPriority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM);
        task.setDueDate(request.getDueDate());
        task.setUser(user);

        return mapToResponse(taskRepository.save(task));
    }

    public List<TaskResponse> getUserTasks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return taskRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<TaskResponse> getUserTasks(String username, TaskStatus status, TaskPriority priority, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        Page<Task> page;
        if (status != null && priority != null) {
            page = taskRepository.findByUserAndStatusAndPriority(user, status, priority, pageable);
        } else if (status != null) {
            page = taskRepository.findByUserAndStatus(user, status, pageable);
        } else if (priority != null) {
            page = taskRepository.findByUserAndPriority(user, priority, pageable);
        } else {
            page = taskRepository.findByUser(user, pageable);
        }

        return page.map(this::mapToResponse);
    }

    public TaskResponse updateTask(Long taskId, TaskRequest request, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        if (!task.getUser().getUsername().equals(username)) {
            throw new RuntimeException("No tienes permiso para modificar esta tarea");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());

        return mapToResponse(taskRepository.save(task));
    }

    public void deleteTask(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        if (!task.getUser().getUsername().equals(username)) {
            throw new RuntimeException("No tienes permiso para eliminar esta tarea");
        }
        taskRepository.delete(task);
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setDueDate(task.getDueDate());
        response.setUsername(task.getUser().getUsername());
        return response;
    }
}