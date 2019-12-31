import store from "../store/configureStore";
import authHeader from "../helpers/authHeader";
import { setAlert, clearAlert } from "../actions/alert";

const validateFiles = files => {
  if (files.length === 0) return true;
  if (files.length > 5) {
    store.dispatch(
      setAlert(
        "Maximum number of files for a post is 5",
        "Post couldn't be created, because there are more than 5 files selected!"
      )
    );

    return false;
  }

  for (let i = 0; i < files.length; i++) {
    if (!files[i].name.match(/.(jpg|jpeg|png|gif)$/i)) {
      store.dispatch(
        setAlert(
          "Post can only be .jpg|.jpeg|.png|.gif",
          "Post couldn't be created. File format is not appropriate! File format can be 'jpg, jpeg, png, gif'."
        )
      );
      return false;
    }
  }

  return true;
};

const validateNewPost = (title, text) => {
  if (title === "") {
    store.dispatch(
      setAlert(
        "Post doesn't have a title",
        "Post couldn't be created, because there is no title!"
      )
    );
    return false;
  }
  if (text === "") {
    store.dispatch(
      setAlert(
        "Post doesn't have text",
        "Post couldn't be created, because there is no text!"
      )
    );
    return false;
  }

  return true;
};
const addNewPost = async (creator, title, text, tags, files) => {
  if (!validateNewPost(title, text)) return;
  if (!validateFiles(files)) return;
  tags = tags.replace(/\s/g, "");
  tags = tags.replace(/\,/g, "");
  tags = tags.toLowerCase();
  const formData = new FormData();
  formData.append("Title", title);
  formData.append("Text", text);
  formData.append("Tags", tags);
  for (let i = 0; i < files.length; i++) formData.append("Files", files[i]);
  formData.append("Username", creator);
  store.dispatch(clearAlert());
  let bearer = authHeader();
  return await fetch("api/post/create", {
    method: "POST",
    body: formData,
    headers: { ...bearer }
  })
    .then(res => {
      if (res.status === 200) return res.json();
      store.dispatch(
        setAlert("Post creation failed", "Post couldn't be created!")
      );
      throw new Error("Post creation failed");
    })
    .then(data => {
      return true;
    })
    .catch(er => console.log(er));
};

export { addNewPost };
