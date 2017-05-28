# Briscola-server
## Init Game
* If there are 5 players in the room, start the game and shuffle the cards
* Assign the player a userId

## Make a call
* start from player who has two of feather
* if pass, don't have to ask 
* else ask the play to make a call (large than current beat point)
* if only one player left, we have a brisk and beat point, ask caller to make the call and confirm the partner.

## Start Game
* start from player who has two of feather
* play one by one

## At the end of game
* if points of caller and callee >= game.beat_point: win!
* else lose

## ToDO
* Chatting room

## Game
* brisk
* called card (tmp to confirm the callee)
* beat point

## User
* Id: 1-5
* Type: {0: caller, 1: callee, 2: innocent}
* Cards: enum
* points

## API
* `/init` send user cards, send back user Id
* `/call/:point?Id=#` make the call 
* `/call/:card?Id=#` call the partner
* `/play/:card?Id=#` play a hand, send back result if need