package com.example.myapplication
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


        val btn = findViewById<Button>(R.id.button)
        btn.setOnClickListener {


                // Create an Intent to start the Login activity
                val intent = Intent(this, login::class.java)


                // Start the Login activity
                startActivity(intent)

    }
}
}