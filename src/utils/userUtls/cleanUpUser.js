const cleanUser = (user, lean = false)=>{
    const source = lean ? user : user._doc;
    const {
    __v,
    password,
    createdAt,
    updatedAt,
    ...cleanuser
    } = source;

    return {...cleanuser};
}

export default cleanUser;