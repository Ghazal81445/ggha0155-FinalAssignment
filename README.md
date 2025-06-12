# FinalAssignment-ggha0155

## Project overview
- This project is user input project which is inspired by the Mondrian's artwork **Broadway Boogie-Woogie**.
- It is an interactive p5.js game based, which the background and environment is inspired by the art work and Destyle.
- User should move the player with their keyboard and reach to the food and avoid touching the blocks.

## My individual approach
  - Having animation and movement with **user interaction** and keyboard.
  - Adding animated Obstacles (blocks) and Red dot as a food for player.
  - putiing slider so user can change block quantity and control game difficulty.
  - Added **game logic** for:
    - Automatic repositioning of food every 3.5 seconds.
    - Block repositioning after each successful food collection.
    - Score and high score tracking.
    - Game reset with **R** key.


## how to use?
1. Move the player using **arrow keys**.
2. **Collect** the red dot before 3.5 seconds pass.
3. **Avoid** the blue blocks. Touching them ends the game.
4. Use the **slider** to increase or decrease the number of blocks (difficulty).
5. Press **‘R’** to restart the game.

   
## My inspiration
- The background is the Broadway Boogie-Woogie with the De Stijl aesthetics.
- I used pixelated modern art to make background a little bit different and more like a game.
- The visuals (block, player and the food) are minimal but basic which is the Destyle style.

## Technical Overview
- Built with modular object-oriented code using:
  - `Player` class (movement, display)
  - `Food` class (timed relocation, collision logic)
  - `Block` class (obstacles with repositioning logic)
  - `Dot` class (pixelated art display)
- Slider: `createSlider(min, max, initialValue)` for real-time block quantity control.
- Timing logic: `millis()` used to reposition food every 3.5 seconds.
- Game UI elements: Score display, instructions, and reset functionality.

## References & Acknowledgments
- Used p5.js official documentation for timing and slider functionality.
- Code snippets and patterns inspired by class materials and guided experimentation.
- Any AI suggestions (like code structure or layout tips) were tested and manually refined.
