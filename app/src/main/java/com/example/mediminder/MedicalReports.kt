package com.example.mediminder

import android.app.Activity
import android.os.Build
import android.util.Log
import android.view.View
import android.view.WindowInsetsController
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.vanpra.composematerialdialogs.MaterialDialog
import com.vanpra.composematerialdialogs.datetime.date.datepicker
import com.vanpra.composematerialdialogs.rememberMaterialDialogState
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter


@Composable
fun MedicalReports (navHostController: NavHostController) {
    HideSystemBarsMediReportPage()
    var MedicineName by rememberSaveable { mutableStateOf("") }
    var Dosage by rememberSaveable { mutableStateOf("") }
    var snoozeOption by rememberSaveable { mutableStateOf(false) }
    var repeatUntilTaken by rememberSaveable { mutableStateOf(false) }
    var beforeFood by rememberSaveable { mutableStateOf(false) }
    var afterFood by rememberSaveable { mutableStateOf(false) }


    val dawn by rememberSaveable { mutableStateOf("Dawn") }
    val morning by rememberSaveable { mutableStateOf("Morning") }
    val afterNoon by rememberSaveable { mutableStateOf("After-Noon") }
    val evening by rememberSaveable { mutableStateOf("Evening") }
    val dusk by rememberSaveable { mutableStateOf("Dusk") }
    val night by rememberSaveable { mutableStateOf("Night") }
    var tasteName by rememberSaveable { mutableStateOf("") }

    var pickTime by remember { mutableStateOf(LocalTime.now()) }
    var pickDateStart by remember { mutableStateOf(LocalDate.now()) }
    var pickEndDate by remember { mutableStateOf(LocalDate.now()) }


    var selectedDosageTimes by rememberSaveable { mutableStateOf(setOf<String>()) }


//    This is for whenever the date changes the time will change by the perspective of date....
    val formattedStartDate by remember {
        derivedStateOf {
            DateTimeFormatter
                .ofPattern("dd MMM yyyy")
                .format(pickDateStart)
        }
    }

    val formattedEndDate by remember {
        derivedStateOf {
            DateTimeFormatter
                .ofPattern("dd MMM yyyy")
                .format(pickEndDate)
        }
    }
// Set time
    val formattedTime by remember {
        derivedStateOf {
            DateTimeFormatter
                .ofPattern("hh:mm")
                .format(pickTime)
        }
    }


    Column(
        modifier = Modifier
            .fillMaxSize()
    ) {
        IconButton(
            onClick = {
                navHostController.popBackStack() // this matches HomePageWithArg

            }, modifier = Modifier
                .padding(top = 8.dp, start = 10.dp, bottom = 8.dp)

        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                contentDescription = "Back",
                modifier = Modifier
                    .size(32.dp)
            )
        }
        Text(
            text = "Add Medication",
            fontSize = 32.sp,
            modifier = Modifier
                .padding(
                    start = 20.dp,
                    bottom = 15.dp
                )
        )


        Text(
            text = "Medicine Name",
            fontSize = 20.sp,
            modifier = Modifier.padding(start = 20.dp)
        )

        Spacer(modifier = Modifier.height(5.dp))

        OutlinedTextField(
            value = MedicineName,
            onValueChange = { MedicineName = it },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
        )


        Spacer(modifier = Modifier.weight(1f))

        Text(
            text = "Dosage",
            fontSize = 20.sp,
            modifier = Modifier.padding(start = 20.dp)
        )

        Spacer(modifier = Modifier.height(5.dp))
//        Dosage Row for Early day
        Row(
            horizontalArrangement = Arrangement.SpaceEvenly,
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.CenterHorizontally)
        ) {
//                        Dawn
            listOf(dawn, morning, afterNoon).forEach { time ->
                val isSelected = selectedDosageTimes.contains(time)
                DosageBox(
                    label = time,
                    isSelected = isSelected,
                    onClick = {
                        selectedDosageTimes =
                            if (isSelected) selectedDosageTimes - time
                            else            selectedDosageTimes + time
                    }
                )
            }

        }

        Spacer(modifier = Modifier.height(5.dp))

//        Dosage Row for late day
        Row(
            horizontalArrangement = Arrangement.SpaceEvenly,
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.CenterHorizontally)
        ) {
            listOf(evening, dusk, night).forEach { time ->
                val isSelected = selectedDosageTimes.contains(time)
                DosageBox(
                    label = time,
                    isSelected = isSelected,
                    onClick = {
                        selectedDosageTimes =
                            if (isSelected) selectedDosageTimes - time
                            else            selectedDosageTimes + time
                    }
                )
            }



        }
        Spacer(modifier = Modifier.weight(1f))

        //            Medicine Start & End date...
        val dateStartDialogState = rememberMaterialDialogState()
        val dateEndDialogState = rememberMaterialDialogState()

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxWidth()
        ) {

            Row (
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ){
                Text(text = "Start Date",
                    fontSize = 20.sp,
                    textAlign = TextAlign.Start)

                Spacer(modifier = Modifier.weight(1f))

                Box(modifier = Modifier
                    .height(56.dp)
                    .width(130.dp)
                    .clip(shape = RoundedCornerShape(8.dp))
                    .clickable(onClick = {
                        dateStartDialogState.show()
                    })
                    .border(width = 1.dp,
                        color = Color.LightGray,
                        shape = RoundedCornerShape(8.dp))
                ){
                    Text(text = formattedStartDate,
                        textAlign = TextAlign.Center,
                        modifier = Modifier
                            .fillMaxWidth()
                            .align(Alignment.Center))
                }

            }


            Spacer(modifier = Modifier.height(5.dp))


            Row (
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ){
                Text(text = "End Date",
                    fontSize = 20.sp,
                    textAlign = TextAlign.Start)

                Spacer(modifier = Modifier.weight(1f))

                Box(modifier = Modifier
                    .height(56.dp)
                    .width(130.dp)
                    .clip(shape = RoundedCornerShape(8.dp))
                    .clickable(onClick = {
                        dateEndDialogState.show()
                    })
                    .border(width = 1.dp,
                        color = Color.LightGray,
                        shape = RoundedCornerShape(8.dp))
                ){
                    Text(text = formattedEndDate,
                        textAlign = TextAlign.Center,
                        modifier = Modifier
                            .fillMaxWidth()
                            .align(Alignment.Center))
                }
            }

        }

        MaterialDialog(
            dialogState = dateStartDialogState,
            buttons = {
                positiveButton("Ok")
                negativeButton("Cancel")
            }
        ) {
            datepicker(
                initialDate = pickDateStart,
                title = "Pick start date"
            ) { date ->
                pickDateStart = date
            }

        }

        MaterialDialog(
           dialogState = dateEndDialogState,
            buttons = {
                positiveButton("Ok")
                negativeButton("Cancel")
            }
        ) {
             datepicker(
                initialDate = pickEndDate,
                title = "Pick end date",

            ) { selectedDate ->
                 if (selectedDate.isAfter(pickDateStart)) {
                     pickEndDate = selectedDate
                 } else {
                     // You can show a Toast or log to inform the user
                     Log.d("DatePicker", "End date must be after start date") }
             }
        }



        Spacer(modifier = Modifier.weight(1f))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Repeat Until Taken",
                fontSize = 20.sp,
                textAlign = TextAlign.Start,
                modifier = Modifier
                    .align(Alignment.CenterVertically)
            )
            Spacer(modifier = Modifier.weight(1f))
            Switch(
                checked = repeatUntilTaken,
                onCheckedChange = { repeatUntilTaken = it }
            )
        }

        Spacer(modifier = Modifier.weight(1f))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Before Food",
                fontSize = 20.sp,
                textAlign = TextAlign.Start,
                modifier = Modifier
                    .align(Alignment.CenterVertically)
            )
            Spacer(modifier = Modifier.weight(1f))
            Switch(
                checked = beforeFood,
                onCheckedChange = { beforeFood = it }
            )
        }

                Spacer(modifier = Modifier.height(5.dp))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "After Food",
                fontSize = 20.sp,
                textAlign = TextAlign.Start,
                modifier = Modifier
                    .align(Alignment.CenterVertically)
            )
            Spacer(modifier = Modifier.weight(1f))
            Switch(
                checked = afterFood,
                onCheckedChange = {
                    afterFood = it
                    if (it) beforeFood = false
                },
                enabled = !beforeFood // disable if beforeFood is true

            )
        }

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = {},
            modifier = Modifier
                .align(Alignment.CenterHorizontally)
                .width(300.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF24B26B),
                contentColor = Color.White
            ),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Save")
        }

            Spacer(modifier = Modifier.weight(1f))





    }



}




@Composable
fun HideSystemBarsMediReportPage() {
    val context = LocalContext.current
    val activity = context as? Activity ?: return

    DisposableEffect(Unit) {
        val window = activity.window

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(false)
            val controller = window.insetsController
            controller?.hide(android.view.WindowInsets.Type.systemBars())
            controller?.systemBarsBehavior =
                WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        } else {
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility =
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                        View.SYSTEM_UI_FLAG_FULLSCREEN
        }

        onDispose {
            // Restore system UI if needed on dispose
        }
    }
}

@Composable
fun DosageBox(label: String, isSelected: Boolean, onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier
            .height(50.dp)
            .width(100.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(if (isSelected) Color(0xFFD3D3D3) else Color.White)
            .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
            .clickable { onClick() }
    ) {
        Text(
            text = label,
            fontSize = 20.sp,
            color = if (isSelected) Color.White else Color.Black,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth()
        )
    }
}