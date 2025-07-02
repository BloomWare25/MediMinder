package com.example.mediminder
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val navController = rememberNavController()
                NavHost(navController = navController, startDestination = Routes.RegisterScreen, builder = {
                    composable(Routes.RegisterScreen){
                        Register(navController)
                    }
                    composable(Routes.LoginScreen){
                        Login(navController)
                    }
                    composable(Routes.HomePageWithArg) {
                        val name = it.arguments?.getString("name")
                        HomePage(navController, name ?: "Guest")
                    }

                    composable(Routes.Profile){
                        Profile(navController)
                    }
                    composable(Routes.MedicalAddScreen){
                        MedicalReports(navController)
                    }
                    composable(Routes.ForgotPass){
                        ForgotPassScreen(navController)
                    }
                })


        }
    }
}