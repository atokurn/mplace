import { tasks, type Task } from "@/db/schema";
import { customAlphabet } from "nanoid";

export function generateRandomTask(): Task {
  const nanoid = customAlphabet("0123456789", 4);
  const statuses = tasks.status.enumValues;
  const labels = tasks.label.enumValues;
  const priorities = tasks.priority.enumValues;

  return {
    id: nanoid(),
    code: `TASK-${nanoid()}`,
    title: `Task ${nanoid()}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    label: labels[Math.floor(Math.random() * labels.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Fungsi utilitas lainnya
// ...