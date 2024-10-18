const handleEditTask = async (taskId, newDescription, newDueDate) => {
    const taskDocRef = doc(db, 'tasks', taskId);
    await updateDoc(taskDocRef, {
      description: newDescription,
      dueDate: new Date(newDueDate),
    });
    alert('Task updated successfully!');
  };
  