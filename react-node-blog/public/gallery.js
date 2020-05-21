"use strict";
const e = React.createElement;

const AppNav = () => (
  <nav class="navbar navbar-dark bg-dark">
    <a class="navbar-brand" href="/">
      {" "}
      Blog
    </a>
    <a
      role="button"
      class="btn btn-outline-info navbar-btn col-md-2"
      href="/login"
    >
      Login
    </a>
    <button
      class="btn btn-outline-info navbar-btn col-md-2"
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
        <li class="nav-item">
          <a class="nav-link" href="/home">
            Home
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/gallery">
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
const ImageGallery=({item})=>{
return(
  <div class="container">       
              <div class="row text-center ">
                <div class="col-6 mx-auto">
                  <img 
                  id={item.id}
                    class="img-fluid img-thumbnail"
                    src={item.src}
                  />
                 
                </div>
              </div>
            </div>
)
}
/*const Card = () =>{
    return ( <div class="card mt-4" Style="width: 100%;">
    <div class="card-body">
      <h5 class="card-title">{title}</h5>
      <p class="card-text">{content}</p>
    </div>
  </div>)
}*/
class Gallery extends React.Component {
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
    console.log(this.state);
  };


  render() {
    return (
      <div>
        <AppNav />
        {this.state.img.length > 0 ? (
          this.state.img.map((file) => (
            <ImageGallery
                   item={file}
                 />
          ))
        ) : (
          <div class="card mt-4" style={{ width: 100 + "%" }}>
          <div class="card-body">No images to show</div>
        </div>
        )}
        <Footer />
      </div>
    );
  }
}

const domContainer = document.querySelector("#root");
ReactDOM.render(e(Gallery), domContainer);
