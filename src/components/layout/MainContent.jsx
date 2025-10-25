const MainContent = ({ children }) => {
    return (
        <div className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
            {children}
        </div>
    );
};

export default MainContent;