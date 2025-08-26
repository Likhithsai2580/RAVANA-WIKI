# Enhanced Snake Agent Architecture



## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Threading Model](#threading-model)
7. [Multiprocessing Components](#multiprocessing-components)
8. [Inter-Process Communication Patterns](#inter-process-communication-patterns)
9. [Component Interactions](#component-interactions)
10. [State Management](#state-management)
11. [Error Handling and Recovery](#error-handling-and-recovery)
12. [Performance Monitoring](#performance-monitoring)
13. [Logging System](#logging-system)
14. [Conclusion](#conclusion)

## Introduction

The Enhanced Snake Agent Architecture represents a sophisticated multi-layered system designed to autonomously improve the RAVANA system through concurrent analysis, experimentation, and implementation of improvements. This architecture leverages both threading and multiprocessing paradigms to achieve high performance while maintaining system stability and safety.

The Enhanced Snake Agent operates as an autonomous improvement system that continuously monitors code changes, analyzes potential improvements, conducts experiments, and implements verified enhancements. It is designed with robust safety mechanisms including graceful shutdown, error recovery, resource monitoring, and thread and process health checks.

This documentation provides a comprehensive analysis of the architecture, focusing on its threading model, multiprocessing components, inter-process communication patterns, and component interactions. The system is designed to be highly modular, with clear separation of concerns between different functional components.

**Section sources**
- [ENHANCED_SNAKE_IMPLEMENTATION.md](file://ENHANCED_SNAKE_IMPLEMENTATION.md#L0-L31)

## Project Structure

The Enhanced Snake Agent is organized within the core directory of the RAVANA repository, with a well-defined structure that separates concerns and promotes modularity. The architecture follows a component-based design with clear boundaries between different functional areas.

The core components are organized in the `core` directory, with specialized modules handling specific aspects of the agent's functionality:

- **Threading components**: Manage concurrent operations within the main process
- **Process management**: Handles CPU-intensive tasks in separate processes
- **IPC (Inter-Process Communication)**: Coordinates communication between threads and processes
- **Logging system**: Provides dedicated logging for different activity types
- **Data models**: Define the structure of data passed between components
- **Configuration**: Manages system settings and parameters

This structure enables the Enhanced Snake Agent to perform multiple tasks concurrently while maintaining clear separation between different types of operations and their associated resources.

``mermaid
graph TD
subgraph "Enhanced Snake Agent Core Components"
A[EnhancedSnakeAgent] --> B[SnakeThreadingManager]
A --> C[SnakeProcessManager]
A --> D[SnakeIPCManager]
A --> E[SnakeLogManager]
A --> F[SnakeFileMonitor]
B --> G[FileMonitorThread]
B --> H[AnalysisThreads]
B --> I[CommunicationThread]
C --> J[ExperimentProcesses]
C --> K[AnalysisProcesses]
C --> L[ImprovementProcess]
D --> M[MessageChannels]
D --> N[ComponentRegistry]
D --> O[MessageRouter]
end
```

**Diagram sources**
- [core/snake_agent_enhanced.py](file://core/snake_agent_enhanced.py#L56-L97)
- [core/snake_threading_manager.py](file://core/snake_threading_manager.py#L45-L67)
- [core/snake_process_manager.py](file://core/snake_process_manager.py#L45-L67)

## Core Components

The Enhanced Snake Agent consists of several core components that work together to achieve autonomous improvement of the RAVANA system. Each component has a specific responsibility and interacts with others through well-defined interfaces.

The primary components include:

- **EnhancedSnakeAgent**: The main controller that coordinates all operations
- **SnakeThreadingManager**: Manages concurrent threads for I/O-bound operations
- **SnakeProcessManager**: Manages worker processes for CPU-intensive tasks
- **SnakeIPCManager**: Facilitates communication between threads and processes
- **SnakeLogManager**: Handles logging for different types of activities
- **SnakeFileMonitor**: Monitors file system changes for code updates

These components work together to create a robust system that can analyze code changes, conduct experiments, and implement improvements while maintaining system stability.

The EnhancedSnakeAgent serves as the central coordinator, initializing all components, setting up callbacks between them, and managing the overall operation lifecycle. It uses a coordination loop to periodically check system health and log performance metrics.

``mermaid
classDiagram
class EnhancedSnakeAgent {
+agi_system
+config
+snake_config
+log_manager
+threading_manager
+process_manager
+file_monitor
+coding_llm
+reasoning_llm
+running
+initialized
+_shutdown_event
+_coordination_lock
+start_time
+improvements_applied
+experiments_completed
+files_analyzed
+communications_sent
+state_file
+initialize() bool
+_setup_component_callbacks()
+start_autonomous_operation()
+_coordination_loop()
+_handle_file_change()
+_process_file_change()
+_process_analysis_task()
+_process_communication()
+_handle_experiment_result()
+_handle_analysis_result()
+_handle_improvement_result()
+_perform_health_check()
+_log_performance_metrics()
+_save_state()
+_load_state()
+stop()
+_cleanup()
+get_status() Dict[str, Any]
}
class SnakeThreadingManager {
+config
+log_manager
+active_threads
+thread_pool
+file_change_queue
+analysis_queue
+communication_queue
+shutdown_event
+coordination_lock
+worker_metrics
+file_change_callback
+analysis_callback
+communication_callback
+started_at
+threads_created
+tasks_processed
+initialize() bool
+start_all_threads() bool
+start_file_monitor_thread() bool
+start_analysis_threads() bool
+start_communication_thread() bool
+start_performance_monitor_thread() bool
+_file_monitor_worker()
+_analysis_worker()
+_communication_worker()
+_performance_monitor_worker()
+set_callbacks()
+queue_file_change() bool
+queue_analysis_task() bool
+queue_communication_message() bool
+get_thread_status() Dict[str, Dict[str, Any]]
+get_queue_status() Dict[str, int]
+get_performance_metrics() Dict[str, Any]
+shutdown() bool
}
class SnakeProcessManager {
+config
+log_manager
+active_processes
+process_pool
+task_queue
+result_queue
+shutdown_event
+experiment_callback
+analysis_callback
+improvement_callback
+tasks_distributed
+results_collected
+initialize() bool
+start_all_processes() bool
+start_experiment_processes() bool
+start_analysis_processes() bool
+start_improvement_process() bool
+_start_worker_process() bool
+start_result_collector()
+_result_collector_loop()
+_process_result()
+_experiment_worker()
+_analysis_worker()
+_improvement_worker()
+set_callbacks()
+distribute_task() bool
+get_process_status() Dict[int, Dict[str, Any]]
+get_queue_status() Dict[str, int]
+shutdown() bool
}
class SnakeIPCManager {
+config
+log_manager
+component_registry
+message_router
+channels
+default_channels
+message_processor_thread
+running
+shutdown_event
+pending_requests
+request_timeout
+total_messages_processed
+message_processing_time
+manager_id
+initialize() bool
+start() bool
+_message_processor_loop()
+_process_message()
+_forward_message()
+_heartbeat_loop()
+_cleanup_loop()
+register_component() bool
+send_message() bool
+send_request() Any
+send_heartbeat()
+broadcast_message()
+add_message_handler()
+get_status() Dict[str, Any]
+shutdown() bool
}
class SnakeLogManager {
+log_dir
+formatter
+json_formatter
+improvement_logger
+experiment_logger
+analysis_logger
+communication_logger
+system_logger
+log_queue
+log_worker_thread
+worker_running
+shutdown_event
+logs_processed
+queue_high_water_mark
+_create_logger() logging.Logger
+start_log_processor()
+stop_log_processor()
+_close_all_handlers()
+_log_processor_worker()
+_process_log_entry()
+_get_logger_for_type() Optional[logging.Logger]
+log_improvement()
+log_experiment()
+log_analysis()
+log_communication()
+log_system_event()
+get_log_statistics() Dict[str, Any]
+get_recent_logs() List[Dict[str, Any]]
+cleanup_old_logs()
}
EnhancedSnakeAgent --> SnakeThreadingManager
EnhancedSnakeAgent --> SnakeProcessManager
EnhancedSnakeAgent --> SnakeIPCManager
EnhancedSnakeAgent --> SnakeLogManager
EnhancedSnakeAgent --> SnakeFileMonitor
```

**Diagram sources**
- [core/snake_agent_enhanced.py](file://core/snake_agent_enhanced.py#L100-L159)
- [core/snake_threading_manager.py](file://core/snake_threading_manager.py#L50-L67)
- [core/snake_process_manager.py](file://core/snake_process_manager.py#L50-L67)
- [core/snake_ipc_manager.py](file://core/snake_ipc_manager.py#L150-L167)
- [core/snake_log_manager.py](file://core/snake_log_manager.py#L100-L117)

## Architecture Overview

The Enhanced Snake Agent employs a multi-layered architecture that combines threading and multiprocessing to achieve optimal performance while maintaining system stability. This hybrid approach allows the agent to handle both I/O-bound and CPU-intensive tasks efficiently.

The architecture consists of three main layers:

1. **Threading Layer**: Handles I/O-bound operations such as file monitoring, code analysis, and communication
2. **Multiprocessing Layer**: Manages CPU-intensive tasks including experiments, deep analysis, and improvement processing
3. **Coordination Layer**: Facilitates communication and synchronization between the threading and multiprocessing layers

The system uses a producer-consumer pattern where the main agent produces tasks that are consumed by worker threads and processes. This design enables the agent to process multiple tasks concurrently while maintaining clear separation between different types of operations.

``mermaid
graph TD
subgraph "Enhanced Snake Agent Architecture"
subgraph "Threading Layer"
A[File Monitor Thread]
B[Analysis Threads]
C[Communication Thread]
D[Performance Monitor Thread]
end
subgraph "Multiprocessing Layer"
E[Experiment Processes]
F[Analysis Processes]
G[Improvement Process]
end
subgraph "Coordination Layer"
H[IPC Manager]
I[Task Queues]
J[Result Queues]
end
subgraph "Support Services"
K[Log Manager]
L[Configuration]
M[State Management]
end
A --> |File Change Events| I
B --> |Analysis Tasks| I
C --> |Communication Tasks| I
I --> |Distribute Tasks| H
H --> |Send Tasks| E
H --> |Send Tasks| F
H --> |Send Tasks| G
E --> |Results| J
F --> |Results| J
G --> |Results| J
J --> |Collect Results| H
H --> |Process Results| EnhancedSnakeAgent
EnhancedSnakeAgent --> |Log Events| K
EnhancedSnakeAgent --> |Save State| M
EnhancedSnakeAgent --> |Read Config| L
end
```

**Diagram sources**
- [ENHANCED_SNAKE_IMPLEMENTATION.md](file://ENHANCED_SNAKE_IMPLEMENTATION.md#L8-L31)
- [core/snake_agent_enhanced.py](file://core/snake_agent_enhanced.py#L56-L97)
- [core/snake_threading_manager.py](file://core/snake_threading_manager.py#L45-L67)
- [core/snake_process_manager.py](file://core/snake_process_manager.py#L45-L67)

## Detailed Component Analysis

### Enhanced Snake Agent Analysis

The EnhancedSnakeAgent class serves as the central controller for the entire system, coordinating all components and managing the overall operation lifecycle. It is responsible for initializing all components, setting up callbacks between them, and managing the coordination loop that maintains system health.

The agent follows a clear initialization sequence:
1. Validate configuration
2. Initialize log manager
3. Initialize LLM interfaces
4. Initialize threading manager
5. Initialize process manager
6. Initialize file monitor
7. Set up component callbacks
8. Load previous state

This sequential initialization ensures that all components are properly set up before the agent begins its autonomous operation.

``mermaid
flowchart TD
Start([EnhancedSnakeAgent Initialization]) --> ValidateConfig["Validate Configuration"]
ValidateConfig --> InitLogManager["Initialize Log Manager"]
InitLogManager --> InitLLM["Initialize LLM Interfaces"]
InitLLM --> InitThreading["Initialize Threading Manager"]
InitThreading --> InitProcess["Initialize Process Manager"]
InitProcess --> InitFileMonitor["Initialize File Monitor"]
InitFileMonitor --> SetupCallbacks["Set Up Component Callbacks"]
SetupCallbacks --> LoadState["Load Previous State"]
LoadState --> MarkInitialized["Mark as Initialized"]
MarkInitialized --> End([Initialization Complete])
ValidateConfig --> |Configuration Issues| LogError["Log Error and Return False"]
LogError --> EndError([Initialization Failed])
InitLogManager --> |Failure| LogError
InitLLM --> |Failure| LogError
InitThreading --> |Failure| LogError
InitProcess --> |Failure| LogError
InitFileMonitor --> |Failure| LogError
```

**Diagram sources**
- [core/snake_agent_enhanced.py](file://core/snake_agent_enhanced.py#L61-L122)

### Threading Manager Analysis

The SnakeThreadingManager class manages concurrent threads for I/O-bound operations in the Enhanced Snake Agent system. It uses Python's threading module and ThreadPoolExecutor to manage a pool of worker threads that handle different types of tasks.

The threading manager creates four types of worker threads:
1. **File Monitor Thread**: Monitors file system changes and queues file change events
2. **Analysis Threads**: Process code analysis tasks and generate improvement proposals
3. **Communication Thread**: Handles communication with the RAVANA system
4. **Performance Monitor Thread**: Collects system performance metrics

Each worker thread runs a dedicated worker function that continuously checks its assigned queue for tasks, processes them, and updates thread state accordingly.

``mermaid
classDiagram
class ThreadState {
+thread_id
+name
+status
+start_time
+last_activity
+processed_items
+error_count
+current_task
+thread_object
+performance_metrics
+to_dict() Dict[str, Any]
+update_activity()
+increment_processed()
+increment_error()
}
class WorkerMetrics {
+worker_id
+worker_type
+start_time
+tasks_completed
+tasks_failed
+total_processing_time
+cpu_samples
+memory_samples
+to_dict() Dict[str, Any]
+record_task_completion()
+record_task_failure()
+add_resource_sample()
}
class SnakeThreadingManager {
+config
+log_manager
+active_threads
+thread_pool
+file_change_queue
+analysis_queue
+communication_queue
+shutdown_event
+coordination_lock
+worker_metrics
+file_change_callback
+analysis_callback
+communication_callback
+started_at
+threads_created
+tasks_processed
+initialize() bool
+start_all_threads() bool
+start_file_monitor_thread() bool
+start_analysis_threads() bool
+start_communication_thread() bool
+start_performance_monitor_thread() bool
+_file_monitor_worker()
+_analysis_worker()
+_communication_worker()
+_performance_monitor_worker()
+set_callbacks()
+queue_file_change() bool
+queue_analysis_task() bool
+queue_communication_message() bool
+get_thread_status() Dict[str, Dict[str, Any]]
+get_queue_status() Dict[str, int]
+get_performance_metrics() Dict[str, Any]
+shutdown() bool
}
SnakeThreadingManager --> ThreadState
SnakeThreadingManager --> WorkerMetrics
```

**Diagram sources**
- [core/snake_threading_manager.py](file://core/snake_threading_manager.py#L100-L159)
- [core/snake_data_models.py](file://core/snake_data_models.py#L50-L80)

### Process Manager Analysis

The SnakeProcessManager class manages worker processes for CPU-intensive tasks in the Enhanced Snake Agent system. It uses Python's multiprocessing module to create separate processes that can execute tasks in parallel without being constrained by the Global Interpreter Lock (GIL).

The process manager creates three types of worker processes:
1. **Experiment Processes**: Conduct experiments to test potential improvements
2. **Analysis Processes**: Perform deep code analysis and generate improvement proposals
3. **Improvement Process**: Implements verified improvements to the codebase

Each worker process runs independently and communicates with the main process through multiprocessing queues. The process manager uses a result collector loop to collect results from worker processes and dispatch them to appropriate callbacks.

``mermaid
classDiagram
class ProcessState {
+process_id
+name
+status
+start_time
+last_heartbeat
+tasks_completed
+tasks_failed
+queue_size
+cpu_usage
+memory_usage
+process_object
+performance_metrics
+to_dict() Dict[str, Any]
+update_heartbeat()
+increment_completed()
+increment_failed()
}
class SnakeProcessManager {
+config
+log_manager
+active_processes
+process_pool
+task_queue
+result_queue
+shutdown_event
+experiment_callback
+analysis_callback
+improvement_callback
+tasks_distributed
+results_collected
+initialize() bool
+start_all_processes() bool
+start_experiment_processes() bool
+start_analysis_processes() bool
+start_improvement_process() bool
+_start_worker_process() bool
+start_result_collector()
+_result_collector_loop()
+_process_result()
+_experiment_worker()
+_analysis_worker()
+_improvement_worker()
+set_callbacks()
+distribute_task() bool
+get_process_status() Dict[int, Dict[str, Any]]
+get_queue_status() Dict[str, int]
+shutdown() bool
}
SnakeProcessManager --> ProcessState
```

**Diagram sources**
- [core/snake_process_manager.py](file://core/snake_process_manager.py#L100-L159)
- [core/snake_data_models.py](file://core/snake_data_models.py#L82-L105)

## Threading Model

The Enhanced Snake Agent employs a sophisticated threading model to handle I/O-bound operations efficiently. The model uses a combination of dedicated worker threads and a thread pool to manage concurrent operations without blocking the main execution thread.

The threading architecture consists of four specialized worker threads:

1. **File Monitor Thread**: Continuously monitors the file system for changes and queues file change events for processing
2. **Analysis Threads**: Multiple threads that process code analysis tasks and generate improvement proposals
3. **Communication Thread**: Handles communication with the RAVANA system, sending updates and receiving instructions
4. **Performance Monitor Thread**: Collects system performance metrics and logs them periodically

Each worker thread runs a dedicated worker function that follows a standard pattern:
- Check for shutdown signal
- Update thread state
- Get task from queue with timeout
- Process task
- Update metrics and thread state
- Mark task as done
- Repeat

This design ensures that worker threads remain responsive and can be gracefully shut down when needed.

``mermaid
sequenceDiagram
participant TM as "SnakeThreadingManager"
participant WT as "Worker Thread"
participant Q as "Task Queue"
participant CB as "Callback"
TM->>WT : Start Thread
WT->>WT : Initialize
loop Continuous Processing
WT->>Q : Check for Task (with timeout)
alt Task Available
Q-->>WT : Return Task
WT->>WT : Update Thread State
WT->>CB : Execute Callback
WT->>WT : Update Metrics
WT->>WT : Update Thread State
WT->>Q : Mark Task as Done
else Timeout
WT->>WT : Continue Loop
end
WT->>WT : Check Shutdown Event
end
TM->>WT : Set Shutdown Event
WT->>WT : Stop Processing
WT->>TM : Thread Stopped
```

**Diagram sources**
- [core/snake_threading_manager.py](file://core/snake_threading_manager.py#L200-L600)

## Multiprocessing Components

The Enhanced Snake Agent utilizes multiprocessing to handle CPU-intensive tasks that would otherwise block the main thread or be constrained by Python's Global Interpreter Lock (GIL). This approach allows the agent to perform computationally expensive operations in parallel with other activities.

The multiprocessing architecture consists of three types of worker processes:

1. **Experiment Processes**: These processes conduct experiments to test potential improvements to the codebase. They run in isolated environments to ensure that experimental changes do not affect the main system.

2. **Analysis Processes**: These processes perform deep code analysis, examining code structure, dependencies, and potential optimization opportunities. They can analyze large codebases without impacting the performance of other system components.

3. **Improvement Process**: This process implements verified improvements to the codebase. It runs with appropriate safety checks to ensure that changes are applied correctly and can be rolled back if necessary.

The process manager uses multiprocessing queues for inter-process communication, allowing tasks to be distributed to worker processes and results to be collected efficiently.

``mermaid
flowchart TD
subgraph "Main Process"
A[SnakeProcessManager]
B[Task Queue]
C[Result Queue]
D[Result Collector]
end
subgraph "Worker Processes"
E[Experiment Process 1]
F[Experiment Process 2]
G[Analysis Process]
H[Improvement Process]
end
A --> |Distribute Tasks| B
B --> |Send Tasks| E
B --> |Send Tasks| F
B --> |Send Tasks| G
B --> |Send Tasks| H
E --> |Send Results| C
F --> |Send Results| C
G --> |Send Results| C
H --> |Send Results| C
C --> |Collect Results| D
D --> |Process Results| A
style A fill:#f9f,stroke:#333
style B fill:#bbf,stroke:#333
style C fill:#bbf,stroke:#333
style D fill:#f9f,stroke:#333
style E fill:#9f9,stroke:#333
style F fill:#9f9,stroke:#333
style G fill:#9f9,stroke:#333
style H fill:#9f9,stroke:#333
```

**Diagram sources**
- [core/snake_process_manager.py](file://core/snake_process_manager.py#L108-L307)

## Inter-Process Communication Patterns

The Enhanced Snake Agent employs a sophisticated inter-process communication (IPC) system to coordinate between threads and processes. The SnakeIPCManager class provides a robust messaging framework that enables reliable communication across different execution contexts.

The IPC system uses several key patterns:

1. **Message Channels**: Dedicated channels for different types of messages (coordination, task distribution, status updates, heartbeats, emergency)
2. **Message Types**: Different message types for various purposes (task requests, task responses, status updates, heartbeats, shutdown, broadcast, errors)
3. **Message Priorities**: Prioritization of messages to ensure critical communications are processed promptly
4. **Request-Response Pattern**: Support for synchronous communication with timeout handling
5. **Broadcast Pattern**: Ability to send messages to all registered components
6. **Heartbeat Mechanism**: Regular heartbeats to monitor component health and detect failures

The IPC manager uses both multiprocessing queues (for cross-process communication) and threading queues (for same-process communication) to ensure efficient message delivery.

``mermaid
classDiagram
class MessageType {
TASK_REQUEST
TASK_RESPONSE
STATUS_UPDATE
HEARTBEAT
SHUTDOWN
BROADCAST
COORDINATION
ERROR
}
class MessagePriority {
CRITICAL
HIGH
MEDIUM
LOW
}
class IPCMessage {
+message_id
+message_type
+priority
+sender_id
+recipient_id
+payload
+timestamp
+correlation_id
+ttl_seconds
+to_dict() Dict[str, Any]
+from_dict() IPCMessage
+is_expired() bool
}
class MessageChannel {
+channel_name
+max_size
+process_queue
+thread_queue
+message_handlers
+messages_sent
+messages_received
+messages_dropped
+send_message() bool
+receive_message() Optional[IPCMessage]
+add_handler()
+handle_message()
+get_status() Dict[str, Any]
}
class ComponentRegistry {
+components
+component_lock
+register_component()
+unregister_component()
+update_heartbeat()
+get_components_by_type() List[str]
+get_component_info() Optional[Dict[str, Any]]
+cleanup_stale_components()
}
class MessageRouter {
+component_registry
+routing_rules
+message_stats
+add_routing_rule()
+route_message() List[str]
}
class SnakeIPCManager {
+config
+log_manager
+component_registry
+message_router
+channels
+default_channels
+message_processor_thread
+running
+shutdown_event
+pending_requests
+request_timeout
+total_messages_processed
+message_processing_time
+manager_id
+initialize() bool
+start() bool
+_message_processor_loop()
+_process_message()
+_forward_message()
+_heartbeat_loop()
+_cleanup_loop()
+register_component() bool
+send_message() bool
+send_request() Any
+send_heartbeat()
+broadcast_message()
+add_message_handler()
+get_status() Dict[str, Any]
+shutdown() bool
}
SnakeIPCManager --> ComponentRegistry
SnakeIPCManager --> MessageRouter
SnakeIPCManager --> MessageChannel
MessageChannel --> IPCMessage
MessageRouter --> ComponentRegistry
```

**Diagram sources**
- [core/snake_ipc_manager.py](file://core/snake_ipc_manager.py#L100-L167)
- [core/snake_data_models.py](file://core/snake_data_models.py#L107-L120)

## Component Interactions

The Enhanced Snake Agent components interact through a well-defined set of interfaces and callbacks, creating a cohesive system where each component can communicate with others without tight coupling.

The primary interaction patterns include:

1. **Callback Registration**: Components register callbacks with each other to receive notifications of events
2. **Task Queuing**: Components queue tasks for other components to process
3. **Event Handling**: Components handle events generated by other components
4. **Status Reporting**: Components report their status to the main agent
5. **Result Processing**: Components process results from other components

The EnhancedSnakeAgent serves as the central coordinator, setting up callbacks between components during initialization and managing the overall flow of information.

```
sequenceDiagram
participant ESA as "EnhancedSnakeAgent"
participant STM as "SnakeThreadingManager"
participant SPM as "SnakeProcessManager"
participant SFM as "SnakeFileMonitor"
participant IPC as "SnakeIPCManager"
ESA-->>ESA : initialize()
ESA-->>STM : set_callbacks()
ESA-->>SPM : set_callbacks()
ESA-->>SFM : set_change_callback()
SFM-->>STM : file_change_callback()
STM-->>STM : _handle_file_change()
STM-->>STM : queue_analysis_task()
STM-->>STM : _analysis_worker()
STM-->>STM : analysis_callback()
STM-->>SPM : distribute_task(experiment)
SPM-->>SPM : _experiment_worker()
SPM-->>SPM : result_queue.put()
SPM-->>SPM : _result_collector_loop()
SPM-->>ESA : experiment_callback()
ESA-->>ESA : _handle_experiment_result()
ESA-->>SPM : distribute_task(improvement)
SPM-->>SPM : _improvement_worker()
SPM-->>SPM : result_queue.put()
SPM-->>SPM : _result_collector_loop()
SPM-->>ESA : improvement_callback()
ESA-->>ESA : _handle_improvement_result()