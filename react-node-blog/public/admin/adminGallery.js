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

const Form = ({ handleSubmit }) => (
  <form
    id="imgForm"
    onSubmit={handleSubmit}
    method="POST"
    enctype="multipart/form-data"
  >
    <input name="imgFile" type="file" />
    <button class="btn btn-info btn-sm ml-3" type="submit" name="upload">
      Upload
    </button>
  </form>
);

const Gallery = ({ item, handleDelete }) => {
  return (
    <div class="container">
      <div class="row text-center ">
        <div class="col-6 mx-auto">
          <img id={item.id} class="img-fluid img-thumbnail" src={item.src} />
          <button onClick={handleDelete} class="lg btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
class AdminGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img: [],
    };
  }
  componentDidMount() {
    this.getImages();
  }

  getImages = async () => {
    const files = await fetch("/admin/upload").then((res) => res.json());
    files.slice(3, 3);
    this.setState({ img: files });
    console.log(this.state.img);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(document.getElementById("imgForm"));

    const body = {
      file: data.get("upload"),
    };

    fetch("/admin/gallery", {
      method: "POST",
      body,
    }).then(function (res) {
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    });
    this.getImages();
  };

  handleDelete = async (imgId) => {
    /*let newImg = this.state.img;
    newImg.splice( newImg.indexOf(e), 1);
    this.setState({ img: newImg })*/
    await fetch(`/admin/${imgId}`, {
      method: "DELETE",
    }).then(await this.getImages());
  };

  render() {
    return (
      <div>
        <AppNav />
        <h2 class="text-center">Image Gallery</h2>

        <Form />
        {this.state.img.length > 0 ? (
          this.state.img.map((file) => (
            <Gallery
              item={file}
              handleDelete={this.handleDelete.bind(this, file.id)}
            />
          ))
        ) : (
          <div class="card mt-4" style={{ width: 100 + "%" }}>
            <div class="card-body">You did not upload any images yet...</div>
          </div>
        )}
      </div>
    );
  }
}

const domContainer = document.querySelector("#root");
ReactDOM.render(e(AdminGallery), domContainer);
