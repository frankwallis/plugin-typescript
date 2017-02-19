import '../shims.js'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { CalculatorStore  } from './calculator-store'
import { CalculatorComponent } from './calculator-component'
import './index.css'

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ CalculatorComponent ],
  bootstrap: [ CalculatorComponent ],
  providers: [ CalculatorStore ]
})
class CalculatorApp { }

platformBrowserDynamic().bootstrapModule(CalculatorApp)
