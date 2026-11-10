#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <emscripten/bind.h>

using namespace std;
using namespace emscripten;

class TaskManager {

private:

    struct Task {

        int id;
        string name;
        string description;
        bool completed;

    };

    vector<Task> tasks;

    int nextId = 1;

    void arrangeTasks() {

        stable_sort(tasks.begin(), tasks.end(),
            [](Task a, Task b) {

                return a.completed < b.completed;

            });

    }

public:

    void addTask(string name, string description) {

        Task newTask;

        newTask.id = nextId;
        newTask.name = name;
        newTask.description = description;
        newTask.completed = false;

        tasks.push_back(newTask);

        nextId++;

        arrangeTasks();

    }

    void deleteTask(int id) {

        for (int i = 0; i < tasks.size(); i++) {

            if (tasks[i].id == id) {

                tasks.erase(tasks.begin() + i);

                break;

            }

        }

    }

    void editTask(int id, string name, string description) {

        for (int i = 0; i < tasks.size(); i++) {

            if (tasks[i].id == id) {

                tasks[i].name = name;
                tasks[i].description = description;

                break;

            }

        }

    }

    void changeStatus(int id) {

        for (int i = 0; i < tasks.size(); i++) {

            if (tasks[i].id == id) {

                tasks[i].completed = !tasks[i].completed;

                break;

            }

        }

        arrangeTasks();

    }

    val getTasks() {

        val result = val::array();

        for (int i = 0; i < tasks.size(); i++) {

            val item = val::object();

            item.set("id", tasks[i].id);
            item.set("name", tasks[i].name);
            item.set("description", tasks[i].description);
            item.set("completed", tasks[i].completed);

            result.call<void>("push", item);

        }

        return result;

    }

};

EMSCRIPTEN_BINDINGS(todo_module) {

    class_<TaskManager>("TaskManager")

    .constructor<>()

    .function("addTask", &TaskManager::addTask)

    .function("deleteTask", &TaskManager::deleteTask)

    .function("editTask", &TaskManager::editTask)

    .function("changeStatus", &TaskManager::changeStatus)

    .function("getTasks", &TaskManager::getTasks);

}