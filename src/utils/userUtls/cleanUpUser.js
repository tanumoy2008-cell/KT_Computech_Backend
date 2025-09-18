const cleanUser = (user, lean = false)=>{
    const source = lean ? user : user._doc;
    const {
    __v,
    _id,
    password,
    createdAt,
    updatedAt,
    cart,
    orderHistory,
    otp,
    otpExpires,
    ...cleanuser
    } = source;

    return {...cleanuser};
}

export default cleanUser;