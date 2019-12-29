const SetConnection = connection => {
  return { type: "SET_CONNECTION", connection };
};

const SetFollows = follows => ({
  type: "SET_FOLLOWS",
  follows
});

const DeleteConnection = () => ({
  type: "DELETE_CONNECTION"
});

export { SetConnection, SetFollows ,DeleteConnection};
