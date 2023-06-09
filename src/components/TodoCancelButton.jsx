const TodoCancelButton = (props) => {
  return (
    <button
      type="button"
      className="btn todo-cancel"
      onClick={() => props.setIsEditing(false)}
    >
      Cancel
      <span className="visually-hidden">renaming {props.name}</span>
    </button>
  );
};

export default TodoCancelButton;
