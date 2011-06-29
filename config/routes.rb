DrCalc::Application.routes.draw do
  resources :calculations
  
  root :to => "application#index"
end
