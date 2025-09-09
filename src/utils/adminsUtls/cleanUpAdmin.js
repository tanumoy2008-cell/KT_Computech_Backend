const cleanAdmin = (admin, lean = false)=>{
    const source = lean ? admin : admin._doc;
    const {
    __v,
    password,        
    createdAt,
    updatedAt,
    ...cleanadmin
    } = source;

    return {...cleanadmin};
}

export default cleanAdmin;