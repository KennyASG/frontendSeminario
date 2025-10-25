const MainContent = ({ children }) => {
    return (
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
            {children}
        </div>
    );
};

export default MainContent;