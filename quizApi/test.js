// // var time = new Date();
// // console.log(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());

// const time = new Date();
// const expirationTime = time.getMinutes()+10
// console.log(expirationTime);


// const reuslt = new Date(Date.now() + 10 * 60000);
// console.log(reuslt.get);

/**old code */
// const expirationTime = 2
// const time = new Date();
// const currentTime = time.getMinutes();

// const timeRemaining = currentTime - expirationTime;

// console.log(timeRemaining);

// let expirationTime = 2 * 60 * 1000; // Convert to milliseconds for accurate calculations

// (async() => {for (let i = 0; i < expirationTime; i += 1000) { // Loop for expiration duration
//   const time = new Date();
//   const currentTime = time.getTime();

//   const remainingTime = Math.floor((expirationTime - currentTime) / 1000); 

//   console.log(`Time remaining: ${remainingTime} seconds`);

//   // Simulate waiting for 1 second (replace with actual code if needed)
//   await new Promise(resolve => setTimeout(resolve, 1000));

//   if (remainingTime <= 0) {
//     console.log("Time expired!");
//     break; // Exit the loop when time runs out
//   }
// }
// })()


// (function() {
//     const currentTime = new Date();
//     const expirationTime = new Date(currentTime.getTime() + (1 * 60 * 1000)); // Adding 2 minutes to current time
//     const remainingTime = expirationTime.getTime() - currentTime.getTime();
  
//     console.log(remainingTime);
//   })();
  
// let tmp = 1
// const expirationTime = new Date(Date.now() + tmp * 60 * 1000); 
// const currentTime = new Date();
// const remainingTime = expirationTime.getTime() - currentTime.getTime();

// if (remainingTime <= 0) {
//   console.log("Time is over from 1 st");
// } else {
//   setTimeout(() => {
//     console.log("Time is over from 2 nd");
//   }, remainingTime);
// }






  // async sendQuestionsById(id: number, answer: any): Promise<void> {
  //   try {

  //     const startTime = new Date(); // Log start time for reference

  //     const result = await Quiz.findOne({
  //       where: {
  //         id: id,
  //       },
  //     });

  //     if(!result){
  //       this.io.emit("questions_controller", "Question not found.");

  //     }
  //     console.log('Fetched quiz data at:', startTime);

  //     const expirationTime = new Date(
  //       Date.now() + result.expirationTime * 60 * 1000
  //     );

  //     const currentTime = new Date();
  //     const remainingTime = expirationTime.getTime() - currentTime.getTime();

  //     console.log('Remaining time (ms):', remainingTime);

  //     if (remainingTime <= 0) {
  //       if (result.ans === answer) {
  //         this.score += 1;
  //         this.io.emit("questions_controller", "Your ans is correct");
  //       } else {
  //         this.io.emit("questions_controller", "Your ans is wrong");
  //       }
  //     } else {
  //       setTimeout(() => {
  //         this.io.emit('questions_controller', `Time remaining:, ${remainingTime}`);
  //       }, remainingTime);
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }