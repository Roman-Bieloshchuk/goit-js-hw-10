import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const daysValue = document.querySelector('.value[data-days]');
const hoursValue = document.querySelector('.value[data-hours]');
const minutesValue = document.querySelector('.value[data-minutes]');
const secondsValue = document.querySelector('.value[data-seconds]');

let selectedTime = null;
let intervalId = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedTime = selectedDates[0].getTime();
    const currentTime = Date.now();

    if (selectedTime <= currentTime) {
      iziToast.show({
        message: 'Please choose a date in the future',
        color: 'red',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  datetimePicker.disabled = true;

  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = selectedTime - currentTime;

    if (deltaTime <= 0) {
      clearInterval(intervalId);
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false;
      iziToast.show({
        message: 'Please choose a date in the future',
        color: 'green',
        position: 'topRight',
      });
      return;
    }

    const time = convertMs(deltaTime);
    updateTimerInterface(time);
  }, 1000);
});

function updateTimerInterface({ days, hours, minutes, seconds }) {
  daysValue.innerHTML = addLeadingZero(days);
  hoursValue.innerHTML = addLeadingZero(hours);
  minutesValue.innerHTML = addLeadingZero(minutes);
  secondsValue.innerHTML = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
