"use strict";

const e = React.createElement;
var d = new Date();

const AppNav = () => (
  <nav class="navbar navbar-dark bg-dark">
    <a class="navbar-brand" href="/">
      My React Blog
    </a>
    <a
      role="button"
      class="btn btn-outline-info navbar-btn col-md-2"
      href="/logout"
    >
      Logout
    </a>

    <button
      class=" btn btn-outline-info navbar-btn col-md-2"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent20"
      aria-controls="navbarSupportedContent20"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      Menu
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent20">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="/home">
            Home{" "}
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/admin/gallery">
            Gallery
          </a>
        </li>
      </ul>
    </div>
  </nav>
);

const Footer = () => (
  <footer class="page-footer font-small special-color-dark pt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-6 mb-4">
          <form class="form-inline">
            <input
              class="form-control form-control-sm mr-3 w-75"
              type="text"
              placeholder="Search"
              aria-label="Search"
            />
            <i class="fas fa-search" aria-hidden="true"></i>
          </form>
        </div>

        <div class="col-md-6 mb-4">
          <form class="input-group">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="Your email"
              aria-label="Your email"
              aria-describedby="basic-addon2"
            />
            <div class="input-group-append">
              <button class="btn btn-sm btn-outline-white my-0" type="button">
                Sign up for the newsletter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </footer>
);

const Card = ({
  item,
  handleSubmit,
  handleEdit,
  handleDelete,
  handleCancel,
}) => {
  const { title, content, editMode } = item;

  if (editMode) {
    return (
      <div class="card mt-4" style={{ width: 100 + "%" }}>
        <div class="card-body">
          <form id="form" onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={item.id} />
            <div class="input-group input-group-sm mb-3">
              <input
                type="text"
                name="title"
                class="form-control"
                placeholder="Title"
                defaultValue={title}
              />
            </div>
            <div class="input-group input-group-sm mb-3">
              <textarea
                name="content"
                class="form-control"
                placeholder="Content"
                defaultValue={content}
              ></textarea>
            </div>

            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-info btn-sm ml-2"
              onClick={handleSubmit}
            >
              Save
            </button>
          </form>
         
        </div>
      </div>
    );
  } else {
    return (
      <div class="card mt-4" Style="width: 100%;">
        <div class="card-body">
        <h6 class="card-text float-right">
            Posted at {item.createdAt.replace("T", " ").slice(0, -5)}
          </h6>
          
          <h2 class="card-title">{title || "No Title"}</h2>

          <h4 class="card-text ">{content || "No Content"}</h4>

          <button
            type="button"
            class="btn btn-outline-danger btn-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="submit"
            class="btn btn-info btn-sm ml-2"
            onClick={handleEdit}
          >
            Edit
          </button>
          <h6 class="card-text float-right">
            Updated at {item.updatedAt.replace("T", " ").slice(0, -5)}
          </h6>
        </div>
        
      </div>
    );
  }
};

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
     
    };
  }
  componentDidMount() {
    this.getPosts();
  }

  /* getImages =async () => {
 
    const files =  await fetch('/upload').then(res => res.json())
  this.setState({img:files})
  console.log(this.state)
 //this.setState(img)
}*/
  getPosts = async () => {
    const data = await fetch("/posts").then((res) => res.json());
    // const data =  res.json()
    data.forEach((item) => (item.editMode = false));
    console.log({ data });
    this.setState({ data });

 
  };

  newPost = () => {
    const post = this.state.data;
    post.unshift({
      editMode: true,
      title: "",
      content: "",
    });
    this.setState(post);
  };

  handleCancel = async () => {
    await this.getPosts();
  };

  handleEdit = (postId) => {
    const data = this.state.data.map((postItem) => {
      if (postItem.id === postId) {
        postItem.editMode = true;
      }
      return postItem;
    });
    this.setState({ data });
  };

  handleDelete = async (postId) => {
    await fetch(`/posts/${postId}`, {
      method: "DELETE",
    }).then(await this.getPosts());
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(document.getElementById("form"));

    const body = JSON.stringify({
      title: data.get("title"),
      content: data.get("content"),
    });

    const headers = {
      "content-type": "application/json",
      accept: "application/json",
    };
    if (data.get("id")) {
      fetch(`/posts/${data.get("id")}`, {
        method: "PUT",
        headers,
        body,
      });
    } else {
      fetch("/posts", {
        method: "POST",
        headers,
        body,
      });
    }
    this.getPosts();
  };

  render() {
    return (
      <div>
        <AppNav />
        <div class="card mt-4" Style="width: 100%;">
          <div class="card-body">you are logged in</div>
        </div>
        <button
          type="button"
          class="mt-4 mb-4 btn btn-primary btn-lg col-md-4 "
          onClick={this.newPost}
        >
          Add post
        </button>
       
        {this.state.data.length > 0 ? (
          this.state.data.map((item) => (
            <Card
              item={item}
              handleSubmit={this.handleSubmit}
              handleEdit={this.handleEdit.bind(this, item.id)}
              handleDelete={this.handleDelete.bind(this, item.id)}
              handleCancel={this.handleCancel}
           
            />
          ))
        ) : (
          <div class="card mt-5 col-sm">
            <div class="card-body">
              You don't have any posts. Use the "Add New Post" button to add
              some new posts!
            </div>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

const domContainer = document.querySelector("#root");
ReactDOM.render(e(Admin), domContainer);
