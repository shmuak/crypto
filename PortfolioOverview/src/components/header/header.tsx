import AddAssetButton from '../addButton';
import './header.scss';
const Header = () => {
    
    return (
        <header>
            <div className="header-container">
                <div className="logo-text">
                    Portfolio Overview
                </div>
                <div >
                    <AddAssetButton />
                </div>
            </div>
        </header>
    )
}

export default Header;