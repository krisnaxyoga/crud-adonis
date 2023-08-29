'use strict'
const Helpers = use('Helpers'); // Import the Helpers module to work with file uploads
const Post = use('App/Models/Post')

class PostController {

    async index({ request, response, view }) {
        const posts = await Post.all()

        return view.render('posts.index', { posts: posts.rows })
    }

    create({ request, response, view }) {
        return view.render('posts.create')
      }
      
      async store({ request, response, view, session }) {
        const post = new Post()
      
        post.title    = request.input('title')
        post.content  = request.input('content')
        // Handling image upload
        
        const image = request.file('image', {
            types: ['image'], // Only allow image files
            size: '2mb', // Maximum file size
        });
        // console.log(image,">>>>>>GAMBAR")
        if (image) {
            const imageName = new Date().getTime() + '.' + image.subtype;
            await image.move(Helpers.publicPath('uploads'), {
            name: imageName,
            overwrite: true,
            });

            if (!image.moved()) {
            session.flash({ error: 'Failed to upload image' });
            return response.redirect('back');
            }

            post.image = 'uploads/' + imageName; // Store the image path in the database
        }
        await post.save()
      
        session.flash({ notification: 'Data Berhasil Disimpan!' })
        return response.route('posts.index')
      
      }
      async edit({ request, response, view, params }) {
        const id    = params.id
        const post  = await Post.find(id)
      
        return view.render('posts.edit', { post: post })
      }
      
      async update({ request, response, params, session }) {
        const id = params.id;
        const post = await Post.find(id);
      
        post.title = request.input('title');
        post.content = request.input('content');
      
        const image = request.file('image', {
          types: ['image'],
          size: '2mb',
        });
      
        if (image) {
          const imageName = new Date().getTime() + '.' + image.subtype;
          await image.move(Helpers.publicPath('uploads'), {
            name: imageName,
            overwrite: true,
          });
      
          if (!image.moved()) {
            session.flash({ error: 'Failed to upload image' });
            return response.redirect('back');
          }
      
          post.image = 'uploads/' + imageName;
        } else {
          post.image = post.image; // This line can be omitted as it doesn't change anything
        }
      
        await post.save();
      
        session.flash({ notification: 'Data Berhasil Diupdate!' });
        return response.route('posts.index');
      }

      async delete({ request, response, view, params, session}) {
        const id = params.id
        const post = await Post.find(id)
        await post.delete()
      
        session.flash({ notification: 'Data Berhasil Dihapus!' })
        return response.route('posts.index')
      }

}

module.exports = PostController
