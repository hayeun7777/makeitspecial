# Make It Special
This app is to help gifting experience easier and more enjoyable!

## My story behind this app
We are all very caring people to our loved ones but sometimes it is tough to track all those dates! 
In addition, it is often stressful to think of a perfect gift item for the person in the last minute! 

I thought of this idea on the weekend right before my sister's birthday and I figured it was little too late to send over a gift all the way to South Korea. 

Here I developed an app where users can record anything that their loved ones need or want in a "#"tag format and get customized gift lists. Also, it displays d-day of the event in the homepage to remind users for buying gifts on time.  

Looking for even more unique gift ideas?! 
This app also contains a section to explore unique gift items for more generic events such as birthday and wedding.

## Wire framing & planning 
I wanted to create an app that almost acts like a personal scheduler once logged in. 

Homepage
![Homepage wireframe](https://res.cloudinary.com/kellyp/image/upload/v1548034910/wireframe1.png)

Fam&Friend list/add page
![Family&Friend wireframe](https://res.cloudinary.com/kellyp/image/upload/v1548034910/wireframe2.png)

Friend detail page
![Friend Detail Page wireframe](https://res.cloudinary.com/kellyp/image/upload/v1548034910/wireframe3.png)

To begin with, I brainstormed models to create and relationships associated with them. 

1) One user to many friend relationship (1:M)
2) Many friends to many tags relationship (M:N)

As a future stretch goal, I would love to upgrade the relationship between users to M:N so that users attending the same event can open a chat room to purchase more costly items together (chip-in).  

## Put things together

Below is the list of routs and models I used to create this app. 

* Routes
  * `GET /` - home page that lists upcoming events with friend names

  * `POST auth/signup` - creates a user and redirects to `/profile` after successful signup
  * `GET /auth/login` -  log in with username and password for exisitng users. 
  * `POST /auth/login` - Redirects to `/profile` if login is successful & redirects to `/login` if username or password is invalid
  * `GET /logout` - redirects to `/auth/login`

  * `GET /friend` - displays all friends added with their tags and edit/delete buttons
  * `POST /friend` - create more friends with name, event, date, and tags
  * `POST /friend/:id` - page that has all information and customized gift list for the specific friend id
  * `GET /friend/edit/:id` - page that gets friend info to edit
  * `POST /friend/edit/:id` - Same edit page as other friend info but for addition or delete of tags of user's choice
  * `PUT /friend/:id` - updates all friend info and redirects to `/friend` page with revision 
  * `DELETE /friend` - deletes association between tag and friend
  * `DELETE /friend/:id` - deletes the friend info off of database

  * `GET /tag/:content` - page that calls all gift items that is related to the tag content from Etsy API 
  * `DELETE /tag/:id` - Deletes the tags

  * `GET /calendar` - page that calls all friend's events and displays on the calendar plug-in

  * `GET /product` - page that displays all unique gifts per occasion using scraped data from uncommongoods.com

* Models
  * `user`
    * Attributes:`fistname`, `lastname`, `email`, `password`, `usename`, `dob`, `bio`, `image` 
    * Associations: Has many friends
  * `friend`
    * Attributes: `friendname`, `date`, `event`, `userId`
    * Associations: Belongs to one user, belongs to many tags
  * `tag`
    * Attributes: `content`
    * Associations: Belongs to many friends
  * `friendTag`
  	* Attributes: `friendId`, `tagId`


## Major Challenges
1) Delete tag from one friend but not from other friends?!

The M:N relationship between friends and tags were a lot more complex than I initially thought. I first attempted to remove everything about the tag from the tag model as well as associations when the user deletes a tag. But what happens if other friends of the user want to keep the tag? It will not generate a gift list because the tag no longer exists in database. 

"onDelete: 'cascade'" allows to delete the tag association with the specific friend but does not remove from the tag database in case it is shared with other friends. In fact, it is not the perfect, most efficient solution because tag db will keep collecting tag words even if a tag has no association with any friend. This can be something I can potentially improve in the future. 

```
module.exports = (sequelize, DataTypes) => {
  const tag = sequelize.define('tag', {
    content: DataTypes.STRING
  }, {});
  tag.associate = function(models) {
    models.tag.belongsToMany(models.friend, { through: 'friendTag', onDelete: 'cascade' });
  };
  return tag;
};
```

2) Creating a product slider per tag for customize gift lists per friend's tag 

![product slider](https://res.cloudinary.com/kellyp/image/upload/v1548032362/tagslider.png)

In order to create a product slider per tag, I had to figure out how to iterate jQuery script. It was very challenging to reach to an idea of putting the entire script tag under forEach function and I was very thrilled to see this working.  

```
<% results.forEach(function(t){ %>
<script>
	$('.<%=t.tag.content%>').slick({
	  dots: true,
		prevArrow: $('.<%=t.tag.content%>.prev'),
		nextArrow: $('.<%=t.tag.content%>.next'),
		  <!-- slide4 conditions -->
	  responsive: [
	    {
	      <!-- slide3 conditions -->
	      }
	    },
	    {
	     <!-- slide2 conditions -->
	      }
	    },
	    {
		 <!-- slide1 conditions -->
	      }
	    }
	  ]
	});
</script>
<% }) %>
```



## Conclusion
It was challenging yet fun to create everything from scratch considering the user's convenience and ideal experience. There were so many ideas that I wanted to implement to this app only if I had unlimited time. Prioritizing the key functions helped me building the MVP on time because researching for a reliable API or webscraping source took significant time in the beginning of the project. Overall, I feel great about this first full-stack app project and learned a lot from the development process which is defintiely applicable to my future projects.


## Built with: 
* Node.js
* Sequelize 
* Postgres
* HTML 
* CSS (Materialize)
* jQuery

## Other Source Credits:
* Etsy: API
* Uncommongoods: webscrape
* Google Fonts