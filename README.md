

To build
```sh
$ npm run build
```


```sh
$ npm start
# or 
$ serve -s build
# or
$ ./start-blkpool.sh 
```

To stop (assuming port 3000)
```sh
$ lsof -ti:3000 | xargs kill -9
```
