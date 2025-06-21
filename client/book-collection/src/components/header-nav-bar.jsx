import './css/header-nav-bar.css';

function HeaderNavBar() {
    return (
        <div className="header-nav-bar">
            <div className="logo">
                <img src="https://www.shutterstock.com/shutterstock/photos/735805411/display_1500/stock-vector-creative-book-logo-design-735805411.jpg" alt="logo-website"></img>
            </div>
            <nav>
                <a href="/">HOME</a>
                <a href="/books">Books</a>
                <a href="/categories">Categories</a>
                <a href="/authors">Authors</a>
            </nav>
            <div className="nav-search">
                <input type="text" className="search" size={10}></input>
                <div className="search-icon">🔎</div>
            </div>
            <div className="login">
                <a href="/">
                    <div className="nav-auth">
                    Sign-up
                    </div>
                </a>
                </div>
                <div className="nav-profile">
                <div className="profile-img">

                </div>
            </div>
        </div>
    );
}
export default HeaderNavBar;