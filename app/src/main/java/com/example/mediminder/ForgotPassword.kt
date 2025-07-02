package com.example.mediminder

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController

@Composable
fun ForgotPassScreen(navHostController: NavHostController){

    Column(modifier = Modifier
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
    }
}