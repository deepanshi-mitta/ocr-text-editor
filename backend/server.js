const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const User = require('./models/User');
const Image = require('./models/Image');

const app = express();

// Middleware
app.use(cors({origin:["https://ocr-text-editor-frontend.vercel.app"]}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/imageTextDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Setup multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to detect bold words based on character thickness (simplified example)
const extractBoldWords = (words) => {
    const boldWords = words.filter(word => {
        // Simple heuristic: count number of black pixels and infer boldness
        const characterThickness = word.confidence; // Placeholder for actual thickness analysis
        return characterThickness > 95; // Adjust threshold as needed
    }).map(word => word.text);
    return boldWords;
};

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;

        const metadata = await sharp(imageBuffer).metadata();
        if (metadata.width < 3 || metadata.height < 3) {
            return res.status(400).send('Image too small to process');
        }

        // Enhance image for better OCR results
        const processedImageBuffer = await sharp(imageBuffer)
            .grayscale()
            .normalize()
            .toBuffer();

        const imageBase64 = processedImageBuffer.toString('base64');
        const result = await Tesseract.recognize(Buffer.from(imageBase64, 'base64'), 'eng', {
            logger: m => console.log(m),
        });

        const { text, words } = result.data;
        const boldWords = extractBoldWords(words);

        const newImage = new Image({
            image: imageBase64,
            text: text,
            boldWords: boldWords,
        });

        await newImage.save();

        // Return the image and text in the response
        res.status(201).json({
            image: imageBase64,
            text: text,
            boldWords: boldWords,
        });
    } catch (err) {
        console.error('Error during image processing:', err);
        res.status(500).send(err.message);
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send(err.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).send('User not found');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(403).send('Invalid credentials');

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
        res.send({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send(err.message);
    }
});

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (err) {
        console.error('Error during token verification:', err);
        res.status(400).send('Invalid token');
    }
};

app.get('/images', authenticateJWT, async (req, res) => {
    try {
        const images = await Image.find();
        res.send(images);
    } catch (err) {
        console.error('Error fetching images:', err);
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
