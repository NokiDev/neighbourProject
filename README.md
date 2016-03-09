# NeighbourProject

### Description : 

Projet effectué dans le cadre de projets en mode entreprise, à l'école INGESUP PARIS.

### Documentation :

-  [Cours Node] (https://github.com/NideXTC/CoursYNov/tree/master/NodeJS)
-  [Projet Exemple] (https://github.com/LeoAttn/NodeJS-Games) Bataille navale en réseau

### Installation : 
- [Node.js 4.3.2](https://nodejs.org/en/)
- [MongoDb](https://www.mongodb.org/)

- lancer la commande (installe les dépendances via npm)
```shell
$ cd neighbourProject
$ sudo  npm install
```
- lancer le serveur
```shell
$ node bin/www
```
ou
```shell
$ npm start
```

###Profile Table

|Field name |Data type | Description |
| :---------| :-------|:-----------|
|id | pk | Primary Key of the object |
| first_name | String | |
| last_name | String | |
| email | String | |
| password | String | |
| address | String | |
| city | String | |
| region | String | |
| country | String | |
| postalCode | String | |
| lattitude | Number | Lattitude Coord for locaton detection |
| longitude | Number |  Longitude Coord for location detection |
| birthDate | Date | |
| avatarLink | String | |
| available | Boolean | |
| note | Number | |
| noticesNb | Number | |
| createdOn | Date | |

###Request Table

|Field name |Data type | Description |
| :---------| :-------|:-----------|
|id | pk | Primary Key of the object |
|description | String | |
| user |  fk | Foreign Key of the object |
| address | String | |
| date | Date | |
| createdOn | Date | |
| nbPeople | Number | |
| urgent | Boolean | |
