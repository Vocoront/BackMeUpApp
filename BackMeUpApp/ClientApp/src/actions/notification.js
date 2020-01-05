const SetConnection = connection => {
  return { type: "SET_CONNECTION", connection };
};

const SetFollows = follows => ({
  type: "SET_FOLLOWS",
  follows
});

const AddNewFollow = follow => ({
  type: "ADD_NEW_FOLLOW",
  follow
});

const RemoveFollow = follow => ({
  type: "REMOVE_FOLLOW",
  follow
});

const DeleteConnection = () => ({
  type: "DELETE_CONNECTION"
});

export {
  SetConnection,
  SetFollows,
  DeleteConnection,
  AddNewFollow,
  RemoveFollow
};
