const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

//localhost is 8000
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description

    if (title.trim() === '' && description.trim() === '') {
        res.render('create', { error: true })
    } else {
        fs.readFile('./data/blogs.json', (err, data) => {
            if (err) throw err

            const blogs = JSON.parse(data)

            blogs.push({
                id: id(),
                title: title,
                description: description,
            })

            fs.writeFile('./data/blogs.json', JSON.stringify(blogs), err => {
                if (err) throw err

                res.render('create', { success: true })
            })
        })

    }
})

app.get('/api/v1/blogs', (req, res) => {
    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        res.json(blogs)
    })
})

app.get('/blogs', (req, res) => {

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        res.render('blogs', { blogs: blogs })
    })
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const blog = blogs.filter(blog => blog.id == id)[0]

        res.render('detail', { blog: blog })
    })


})
app.get('/blogs/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const filteredBlogs = blogs.filter(blog => blog.id != id)

        fs.writeFile('./data/blogs.json', JSON.stringify(filteredBlogs), err => {
            if (err) throw err

            res.render('blogs', { id: id, blogs: filteredBlogs })
        })
    })
})



app.listen(8000, err => {
    if (err) console.log(err)

    console.log('Server is running on port 8000...')
})

function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}