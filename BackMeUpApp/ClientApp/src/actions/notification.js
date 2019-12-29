const SetConnection = connection => {
  return { type: "SET_CONNECTION", connection };
};

const SetFollows = follows => ({
  type: "SET_FOLLOWS",
  follows
});

export { SetConnection, SetFollows };
