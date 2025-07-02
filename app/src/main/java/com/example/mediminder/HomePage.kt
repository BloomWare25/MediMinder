package com.example.mediminder

import android.app.Activity
import android.os.Build
import android.view.View
import android.view.WindowInsetsController
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ModifierLocalBeyondBoundsLayout
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import java.util.Calendar


@Composable
fun HomePage (navHostController: NavHostController,name: String) {
    HideSystemBarsMainPage()
    var UserName by rememberSaveable { mutableStateOf(name) }
    var medicineName by rememberSaveable { mutableStateOf("Paracetamol") }
    var medicineTime by rememberSaveable { mutableStateOf("8:00 am") }



    Column(
        modifier = Modifier
            .background(Color(0xFFF0FDFF))
            .fillMaxSize()
            .padding(WindowInsets.systemBars.asPaddingValues())
    ) {

        val currentHour = remember {
            Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        }

        val greeting = when (currentHour) {
            in 5..11 -> "Good Morning"
            in 12..16 -> "Good Afternoon"
            in 17..20 -> "Good Evening"
            else -> "Good Night"
        }

        Column(
            horizontalAlignment = Alignment.Start,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .padding(20.dp)
                .height(75.dp)
                .fillMaxWidth()
                .padding(horizontal = 10.dp)
        ) {
            Text(
                text = "$greeting, $UserName",
                fontSize = 35.sp,
                textAlign = TextAlign.Center,
                style = MaterialTheme.typography.headlineMedium,
            )

        }
        Spacer(modifier = Modifier.height(15.dp))

//        Medicine info bar...
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp)
                .padding(horizontal = 25.dp)
                .clip(shape = RoundedCornerShape(8.dp))
                .background(Color(0xFFC5EFFC))
                .align (alignment = Alignment.CenterHorizontally)
        ) {
            Row (
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxWidth()

            ) {
                Image(
                    painter = painterResource(id = R.drawable.medicinewithoutbackground),
                    contentDescription = "Medilogo",
                    modifier = Modifier
                        .size(120.dp)
                )


                Column (modifier = Modifier
                    .weight(1f)
                    .padding(top = 40.dp)

                ){
                    Text(
                        text = medicineName,
                        fontSize = 25.sp,
                        fontFamily = FontFamily.SansSerif
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = medicineTime,
                        fontSize = 20.sp,
                        fontFamily = FontFamily.SansSerif,
                        color = Color.Gray
                    )
                }

            }
            Spacer(modifier = Modifier.weight(1f))


            Row(
                horizontalArrangement = Arrangement.SpaceAround,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .align(Alignment.CenterHorizontally)

            ){
                Button(onClick = {

                }, modifier = Modifier
                    .weight(1f)
                    .padding(end = 8.dp),
                        colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF6EA5F7),
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(8.dp)
                ) {
                    Text(text = "Taken")
                }

                Button(onClick = {

                },
                    modifier = Modifier
                        .weight(1f)
                        .padding(end = 8.dp),
                    colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF6EA5F7),
                    contentColor = Color.White
                ),
                    shape = RoundedCornerShape(8.dp)) {
                    Text(text = "Snooze")
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(horizontal = 25.dp)
                .clip(shape = RoundedCornerShape(8.dp))
                .background(Color.White)
                .padding(8.dp)
                .border(2.dp, Color.White, RoundedCornerShape(8.dp))
                .align (alignment = Alignment.CenterHorizontally)
        ) {
            // Items go here
        }
        Spacer(modifier = Modifier.height(8.dp))
        Row (
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceAround,
            modifier = Modifier
                .fillMaxWidth()
                .clip(shape = RoundedCornerShape(25))
                .background(Color.White)
                .height(80.dp)
                .align (alignment = Alignment.CenterHorizontally)
        ){

            BottomNavItem(Icons.Filled.Home, "Home", color = Color(0xFF6EA5F7)) {
                navHostController.navigate(Routes.HomePage + "/${UserName}")            }
            BottomNavItem(Icons.Filled.AddCircle, "Add", color = Color(0xFF6EA5F7)) {
                navHostController.navigate(Routes.MedicalAddScreen)
            }
            BottomNavItem(Icons.Filled.AccountCircle, "Profile", color = Color(0xFF6EA5F7)) {
                navHostController.navigate(Routes.Profile)
            }


        }
    }
}



    @Composable
    fun HideSystemBarsMainPage() {
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
fun BottomNavItem(
    icon: ImageVector,
    label: String,
    color: Color = Color.Black,
    onClick: () -> Unit
) {
    
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clickable { onClick() }
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            modifier = Modifier.size(35.dp),
            tint = color
        )
        Text(
            text = label,
            fontSize = 12.sp,
            color = color
        )
    }
}