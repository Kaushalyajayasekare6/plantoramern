import React, {useState} from "react";

function User() {
    const [view, setView] = useState("list");
    const [selectedUser, setSelectedUser] = useState(null);

    const [users, setUsers] = useState([
        { id: 1, name: "John", email: "john@test.com", role: "Admin" },
        { id: 2, name: "Smith", email: "smith@test.com", role: "User"}
    ]);

    const [formData, setFormData] = useState({name: "", email: "", role: "User"});

    useEffect(() => {
        if (view === "edit" && selectedUser) {
            setFormData({
                name: selectedUser.name,
                email: selectedUser.email,
                role: selectedUser.role
            });
        } else if (view === "add") {
                setFormData({ name: "", email: "", role: "User"});
        }
    }, [view, selectedUser]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({ ...prev, [name]: value}));
    };

    // Add new user on form submit
    const handleAddSubmit = (e) => {
        e.preventdefault();
        const newUser = {
            id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
            ...formData,
        }
}

}