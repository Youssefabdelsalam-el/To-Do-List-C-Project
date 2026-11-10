var manager;
var currentFilter = "all";
var editingId = 0;
var Module = {

    onRuntimeInitialized: function () {

        manager = new Module.TaskManager();

        showTasks();

    }

};

window.addEventListener("DOMContentLoaded", function () {

    var form = document.getElementById("taskForm");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        var name = document.getElementById("taskName").value.trim();

        var description = document.getElementById("taskDescription").value.trim();

        if (name === "") {
            alert("Please enter task name");
            return;
        }

        if (editingId === 0) {

            manager.addTask(name, description);

        } else {

            manager.editTask(editingId, name, description);

            editingId = 0;

            document.getElementById("submitText").textContent = "Add Task";

            document.getElementById("cancelEdit").classList.add("hidden");

        }

        form.reset();

        showTasks();

    });

        document.getElementById("cancelEdit").addEventListener("click", function () {

        editingId = 0;

        document.getElementById("taskForm").reset();

        document.getElementById("submitText").textContent = "Add Task";

        this.classList.add("hidden");
    });

    document.querySelectorAll(".filters button").forEach(function (button) {

        button.addEventListener("click", function () {

            document.querySelectorAll(".filters button").forEach(function (btn) {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            currentFilter = this.dataset.filter;

            showTasks();

        });

    });

});

function showTasks() {

    if (!manager) return;

    var tasks = manager.getTasks();

    var list = document.getElementById("taskList");

    list.innerHTML = "";

    var count = 0;

    tasks.forEach(function (task, index) {

        if (currentFilter === "waiting" && task.completed) return;

        if (currentFilter === "completed" && !task.completed) return;

        count++;

        var row = document.createElement("tr");

        if (task.completed) {
            row.classList.add("completed");
        }

        row.innerHTML = `
            <td>${index + 1}</td>

            <td>
                <button class="status-button">
                    <iconify-icon icon="${
                        task.completed
                        ? 'mdi:check-circle'
                        : 'mdi:checkbox-blank-circle-outline'
                    }"></iconify-icon>
                </button>
            </td>
            <td class="task-title"></td>

            <td class="task-description"></td>


            <td>
                <button class="action-button edit">
                    <iconify-icon icon="mdi:pencil"></iconify-icon>
                </button>

                <button class="action-button delete">
                    <iconify-icon icon="mdi:delete"></iconify-icon>
                </button>
            </td>
        `;

        row.querySelector(".task-title").textContent = task.name;

        row.querySelector(".task-description").textContent =
            task.description || "-";

        row.querySelector(".status-button").addEventListener("click", function () {

            manager.changeStatus(task.id);

            showTasks();

        });

        row.querySelector(".edit").addEventListener("click", function () {

            editingId = task.id;

            document.getElementById("taskName").value = task.name;

            document.getElementById("taskDescription").value = task.description;

            document.getElementById("submitText").textContent = "Save Changes";

            document.getElementById("cancelEdit").classList.remove("hidden");

            window.scrollTo(0, 0);

        });

        row.querySelector(".delete").addEventListener("click", function () {

            if (confirm("Delete this task?")) {

                manager.deleteTask(task.id);

                showTasks();

            }

        });

        list.appendChild(row);

    });

    if (count === 0) {

        list.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No Tasks Found
                </td>
            </tr>
        `;

    }

    document.getElementById("taskCount").textContent = count + " tasks";

}