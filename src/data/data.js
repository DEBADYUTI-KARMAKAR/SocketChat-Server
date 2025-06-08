const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
      },
      {
        name: "Rahul",
        email: "rahul@example.com",
      },
    ],
    _id: "925a087e11b25468bc9c4dd4",
    chatName: "Alice Johnson",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Tom Hardy",
        email: "tom@example.com",
      },
      {
        name: "Rahul",
        email: "rahul@example.com",
      },
    ],
    _id: "925a087e18c25468b21c4dd4",
    chatName: "Tom Hardy",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Emma Watson",
        email: "emma@example.com",
      },
      {
        name: "Rahul",
        email: "rahul@example.com",
      },
    ],
    _id: "925a087e18c2d468bc9c4dd4",
    chatName: "Emma Watson",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
      },
      {
        name: "Rahul",
        email: "rahul@example.com",
      },
      {
        name: "Tom Hardy",
        email: "tom@example.com",
      },
    ],
    _id: "925a518c4081150716472c99",
    chatName: "Team Alpha",
    groupAdmin: {
      name: "Tom Hardy",
      email: "tom@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Sophia Lee",
        email: "sophia@example.com",
      },
      {
        name: "Rahul",
        email: "rahul@example.com",
      },
    ],
    _id: "925a087e18c25468bc9cfdd4",
    chatName: "Sophia Lee",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Emma Watson",
        email: "emma@example.com",
      },
      {
        name: "Rahul",
        email: "rahul@example.com",
      },
      {
        name: "Sophia Lee",
        email: "sophia@example.com",
      },
    ],
    _id: "925a518c4081150016472c88",
    chatName: "Project X",
    groupAdmin: {
      name: "Emma Watson",
      email: "emma@example.com",
    },
  },
];

module.exports = {
  chats,
};
