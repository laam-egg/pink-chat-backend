import User from "../models/User.js";
import HttpException from "../exceptions/HttpException.js";
import bcrypt from "bcryptjs";
import $textSearch from "../helpers/$textSearch.js";

async function hash(password) {
    // https://stackoverflow.com/a/67052696/13680015
    return await bcrypt.hash(password, 10);
}

export async function listAllUsers(req, res) {
    const { fullNameContains } = req.body;
    const filter = {};
    $textSearch("fullName", fullNameContains, filter);
    let resBody = {
        list: (await User.find(filter)).map((user) => {
            user = user.toObject();
            delete user.passwordHash;
            return user;
        })
    };
    res.status(200).json(resBody);
}

export async function getSelfUserInfo(req, res) {
    const user = req.user.toObject();
    delete user.passwordHash;
    res.status(200).json(user);
}

export async function getAnotherUserInfo(req, res) {
    const userId = req.params.id;
    let user = await User.findById(userId);
    user = user.toObject();
    delete user.passwordHash;

    res.status(200).json(user);
}

export async function createUser(req, res) {
    const { email, password, fullName } = req.body;

    if (await User.findOne({ email })) {
        throw new HttpException(409, "Email already registered");
    }

    const passwordHash = await hash(password);

    let newUser = await User.create({
        email,
        passwordHash,
        fullName
    });

    newUser = newUser.toObject();
    delete newUser.passwordHash;

    res.status(200).json(newUser);
}

export async function editUser(req, res) {
    const newEmail = req.body.email;
    const newPassword = req.body.password;
    const newFullName = req.body.fullName;

    const updates = {};
    
    if (newEmail && newEmail != req.user.email) {
        if (await User.findOne({ email: newEmail })) {
            throw new HttpException(409, "Email already registered");
        }
        updates.email = newEmail;
    }

    if (newPassword) {
        updates.passwordHash = await hash(newPassword);
    }

    if (newFullName) {
        updates.fullName = newFullName;
    }

    let updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true }
    );
    updatedUser = updatedUser.toObject();
    delete updatedUser.passwordHash;

    res.status(200).json(updatedUser);
}

export async function forgotPassword(req, res) {
    const { email } = req.body;

    const user = User.findOne({ email });
    if (!user) {
        throw new HttpException(404, "User not found");
    }

    const newPassword = "abc@123";
    user.passwordHash = hash(newPassword);

    res.status(200).json({
        newPassword
    });
}

export async function deleteUser(req, res) {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({});
}
