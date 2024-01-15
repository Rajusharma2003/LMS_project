import app from"./app.js"


const PORT = process.env.PORT || 5000

app.listen( PORT , () => {
    console.log(`server is listen at http://localhost:${PORT}`);
})